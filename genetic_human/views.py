import random

from django.db.models.aggregates import Max
from django.http.response import JsonResponse

from genetic_human.models import Algorithm, Gene, Generation, Individual, Genoma


def get_algorithms(request):
    items = []
    for algorithm in Algorithm.objects.all():
        item = {'population_size': algorithm.population_size, 'genes': []}
        for gene in Gene.objects.filter(algorithm=algorithm):
            item['genes'].append({'name': gene.name, 'gene_type': gene.gene_type})

        items.append(item)

    return JsonResponse({
        'meta': {},
        'items': items
    })


def fetch_individuals(request, algorithm_id):
    if Generation.objects.filter(algorithm_id=algorithm_id).count() == 0:
        start_algorithm(algorithm_id)

    algorithm = Algorithm.objects.get(algorithm_id)
    current_generation_number = get_current_generation_number(algorithm)

    current_generation = Generation.objects.get(algorithm=algorithm, number=current_generation_number)

    items = []
    for individual in current_generation.individuals:
        item = {'id': individual.id, 'value': individual.fitness_value, 'genoma': {}}
        genoma_items = Genoma.objects.filter(individual=individual)

        for genoma_item in genoma_items:
            item['genoma'][genoma_item.gene.name] = genoma_item.string_value

        items.append(item)

    return JsonResponse({
        'meta': {},
        'items': items
    })


def update_individual(request, algorithm_id):
    individual_id = request.POST['individual_id']
    value = float(request.POST['value'])

    individual = Individual.objects.get(individual_id)
    individual.fitness_value = value
    individual.save()

    update_generation_if_complete(algorithm_id)


def create_individual(algorithm, genes):
    individual = Individual(fitness_value=-1, algorithm=algorithm)

    for gene in genes:
        Genoma(gene=gene, individual=individual, string_value=gene.generate_random()).save()


def start_algorithm(algorithm_id):
    algorithm = Algorithm.objects.get(algorithm_id)
    genes = Gene.objects.filter(algorithm_id=algorithm.id)
    for i in range(algorithm.options.population_size):
        create_individual(algorithm, genes)


def select_survived_individuals(individuals, n):
    sorted_individuals = sorted(individuals, key=lambda individual: individual.fitness_value)
    return sorted_individuals[:n]


def select_random(individuals):
    return random.choice(individuals)


def generate_son_via_crossover(genes, father, mother):
    son = Individual(algorithm=father.algorithm, fitness_value=-1)
    son.save()

    for gene in genes:
        father_side = Genoma.get(individual=father, gene=gene)
        mother_side = Genoma.get(individual=mother, gene=gene)
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
            mutant_genoma = Genoma.object.get(gene=mutant_gene, individual=mutant)
            mutant_genoma.string_value = mutant_gene.generate_random()
            mutant_genoma.save()

    return ret


def update_generation_if_complete(algorithm_id):
    algorithm = Algorithm.objects.get(algorithm_id)
    current_generation_number = get_current_generation_number(algorithm)
    current_generation = Generation.objects.get(algorithm=algorithm, number=current_generation_number)
    if not is_generation_complete(current_generation):
        return

    population_size = algorithm.options.population_size
    genes = Gene.objects.filter(algorithm_id=algorithm.id)

    survived_individuals = select_survived_individuals(current_generation.individuals, population_size * 0.3)
    sons = generate_via_crossover(genes, current_generation.individuals, population_size * 0.6)
    mutatants = generate_via_mutation(algorithm, current_generation.individuals, population_size * 0.1)
    number_of_individuals_to_generate = population_size - len(survived_individuals) - len(sons) - len(mutatants)

    for _ in range(number_of_individuals_to_generate):
        create_individual(algorithm, genes)

    new_generation = Generation(number=current_generation_number + 1, algorithm=algorithm)
    for individual in survived_individuals + sons + mutatants + number_of_individuals_to_generate:
        new_generation.individuals.add(individual)

    new_generation.save()


def get_current_generation_number(algorithm):
    return Generation.objects.filter(algorithm=algorithm).aggregate(Max('number'))


def is_generation_complete(generation):
    for individual in generation.individuals:
        if individual.fitness_value < 0:
            return False

    return True
