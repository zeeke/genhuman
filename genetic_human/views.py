import json
import random

from django.db import transaction
from django.db.models.aggregates import Max
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from genetic_human.models import Algorithm, Gene, Generation, Individual, Genoma


@require_http_methods(["GET"])
def get_algorithms(request):
    items = []
    for algorithm in Algorithm.objects.all():
        item = {
            'id': algorithm.id,
            'title': algorithm.title,
            'template': algorithm.template,
            'population_size': algorithm.options.population_size,
            'genes': []
        }

        for gene in Gene.objects.filter(algorithm=algorithm):
            item['genes'].append({'name': gene.name, 'gene_type': gene.gene_type})

        items.append(item)

    return JsonResponse({
        'meta': {},
        'items': items
    })


@csrf_exempt
@require_http_methods(["POST"])
def reset_algorithm(request, algorithm_id):
    algorithm = Algorithm.objects.get(id=algorithm_id)
    Generation.objects.filter(algorithm=algorithm).all().delete()
    return JsonResponse({
        'meta': {}
    })


@require_http_methods(["GET"])
def fetch_individuals(request, algorithm_id):
    if Generation.objects.filter(algorithm_id=algorithm_id).count() == 0:
        start_algorithm(algorithm_id)

    algorithm = Algorithm.objects.get(id=algorithm_id)
    current_generation_number = get_current_generation_number(algorithm)

    current_generation = Generation.objects.get(algorithm=algorithm, number=current_generation_number)

    items = []
    for individual in current_generation.individuals.all():
        items.append(individual.get_as_json())

    return JsonResponse({
        'meta': {},
        'items': items
    })


@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def update_individual(request, algorithm_id):
    body = json.loads(request.body)
    individual_id = body['individual_id']
    value = float(body['value'])

    individual = Individual.objects.get(id=individual_id)
    individual.fitness_value = value
    individual.save()

    update_generation_if_complete(algorithm_id)

    return JsonResponse({
        'meta': {}
    })


def create_individual(algorithm, genes):
    individual = Individual(fitness_value=-1, algorithm=algorithm)
    individual.save()

    for gene in genes:
        Genoma(gene=gene, individual=individual, string_value=gene.generate_random()).save()

    return individual


def start_algorithm(algorithm_id):
    algorithm = Algorithm.objects.get(id=algorithm_id)
    genes = Gene.objects.filter(algorithm_id=algorithm.id)

    individuals = []
    for i in range(algorithm.options.population_size):
        individuals.append(create_individual(algorithm, genes))

    create_generation(algorithm, 0, individuals)


def select_elite_individuals(individuals, n):
    return select_top_n(individuals, n)


def select_top_n(individuals, n):
    sorted_individuals = sorted(individuals, key=lambda individual: -1 * individual.fitness_value)
    return sorted_individuals[:n]


def select_random(individuals):
    return random.choice(individuals)


def generate_son_via_crossover(genes, father, mother):
    son = Individual(algorithm=father.algorithm, fitness_value=-1)
    son.save()

    for gene in genes:
        father_side = Genoma.objects.get(individual=father, gene=gene)
        mother_side = Genoma.objects.get(individual=mother, gene=gene)
        Genoma(gene=gene, individual=son, string_value=gene.mix(father_side, mother_side)).save()

    return son


def generate_via_crossover(genes, individuals, n):
    ret = []
    for i in range(n):
        father = select_random(individuals)
        mother = select_random(individuals)
        son = generate_son_via_crossover(genes, father, mother)
        ret.append(son)

    return ret


def generate_via_mutation(genes, individuals, n):
    ret = []
    for _ in range(n):
        individual = select_random(individuals)
        mutant = Individual(algorithm=individual.algorithm)
        mutant.fitness_value = -1
        mutant.save()
        ret.append(mutant)

        for genoma in Genoma.objects.filter(individual=individual):
            Genoma(gene=genoma.gene, individual=mutant, string_value=genoma.string_value).save()

        for i in range(len(genes) / 2):
            mutant_gene = select_random(genes)
            mutant_genoma = Genoma.objects.get(gene=mutant_gene, individual=mutant)
            mutant_genoma.string_value = mutant_gene.generate_random()
            mutant_genoma.save()

    return ret


def update_generation_if_complete(algorithm_id):
    algorithm = Algorithm.objects.get(id=algorithm_id)
    current_generation_number = get_current_generation_number(algorithm)
    current_generation = Generation.objects.get(algorithm=algorithm, number=current_generation_number)
    if not is_generation_complete(current_generation):
        return

    create_new_generation(algorithm, current_generation)


def create_new_generation(algorithm, current_generation):
    population_size = algorithm.options.population_size
    genes = Gene.objects.filter(algorithm_id=algorithm.id)
    current_individuals = current_generation.individuals.all()
    elite_individuals = select_elite_individuals(current_individuals, int(population_size * 0.1))
    sons = generate_via_crossover(genes, select_top_n(current_individuals, int(population_size * 0.6)), int(population_size * 0.8))
    mutants = generate_via_mutation(genes, current_individuals, int(population_size * 0.1))
    number_of_individuals_to_generate = population_size - len(elite_individuals) - len(sons) - len(mutants)
    new_individuals = []
    for _ in range(number_of_individuals_to_generate):
        new_individuals.append(create_individual(algorithm, genes))
    create_generation(algorithm, current_generation.number + 1, mutants + new_individuals + sons + elite_individuals)


def create_generation(algorithm, generation_number, individuals):
    new_generation = Generation(number=generation_number, algorithm=algorithm)
    new_generation.save()
    for individual in individuals:
        new_generation.individuals.add(individual)
    new_generation.save()


def get_current_generation_number(algorithm):
    return Generation.objects.filter(algorithm=algorithm).aggregate(Max('number'))['number__max']


def is_generation_complete(generation):
    for individual in generation.individuals.all():
        if individual.fitness_value < 0:
            return False

    return True
