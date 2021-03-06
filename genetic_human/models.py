from __future__ import unicode_literals

import json
import random

from django.db import models


class AlgorithmOptions(models.Model):
    population_size = models.IntegerField(default=20)


class Algorithm(models.Model):
    title = models.CharField(max_length=100)
    template = models.TextField()
    options = models.ForeignKey(AlgorithmOptions, on_delete=models.CASCADE)

    def __str__(self):
        return "(Algorithm) " + self.title.__str__()


class Individual(models.Model):
    fitness_value = models.FloatField()
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE)

    def get_as_json(self):
        item = {'id': self.id, 'value': self.fitness_value, 'genoma': {}}
        genoma_items = Genoma.objects.filter(individual=self)
        for genoma_item in genoma_items:
            item['genoma'][genoma_item.gene.name] = genoma_item.string_value
        return item


class Generation(models.Model):
    number = models.IntegerField()
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE)
    individuals = models.ManyToManyField(Individual)


class Gene(models.Model):
    name = models.CharField(max_length=50)
    gene_type = models.CharField(max_length=50)
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE)

    def __str__(self):
        return "({}) {}".format(self.gene_type, self.name)

    def generate_random(self):
        if self.gene_type == 'COLOR':
            return json.dumps([
                random.randrange(0, 256),
                random.randrange(0, 256),
                random.randrange(0, 256),
            ])
        elif self.gene_type == 'FLOAT':
            return str(random.random())
        else:
            raise Exception("Can't generate gene type " + self.gene_type.__str__())

    def mix(self, father_genoma, mother_genoma):
        if self.gene_type == 'COLOR':
            father_value = json.loads(father_genoma.string_value)
            mother_value = json.loads(mother_genoma.string_value)

            return json.dumps([
                (father_value[0] + mother_value[0]) / 2,
                (father_value[1] + mother_value[1]) / 2,
                (father_value[2] + mother_value[2]) / 2,
            ])

        elif self.gene_type == 'FLOAT':
            return str(
                (float(father_genoma.string_value) + float(mother_genoma.string_value)) / 2
            )
        else:
            raise Exception("Can't mix gene type " + self.gene_type.__str__())


class Genoma(models.Model):
    individual = models.ForeignKey(Individual, on_delete=models.CASCADE)
    gene = models.ForeignKey(Gene, on_delete=models.CASCADE)
    string_value = models.CharField(max_length=100)
