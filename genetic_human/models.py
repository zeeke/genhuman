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


class Individual(models.Model):
    fitness_value = models.FloatField()
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE)


class Generation(models.Model):
    number = models.IntegerField()
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE)
    individuals = models.ManyToManyField(Individual)


class Gene(models.Model):
    name = models.CharField(max_length=50, unique=True)
    gene_type = models.CharField(max_length=50)
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE)

    def generate_random(self):
        if self.gene_type == 'COLOR':
            return json.dumps([
                random.randrange(0, 256),
                random.randrange(0, 256),
                random.randrange(0, 256),
            ])

    def mix(self, father_genoma, mother_genoma):
        if self.gene_type == 'COLOR':
            father_value = json.loads(father_genoma.string_value)
            mother_value = json.loads(mother_genoma.string_value)

            return [
                (father_value[0] + mother_value[0]) / 2,
                (father_value[1] + mother_value[1]) / 2,
                (father_value[2] + mother_value[2]) / 2,
            ]


class Genoma(models.Model):
    individual = models.ForeignKey(Individual, on_delete=models.CASCADE)
    gene = models.ForeignKey(Gene, on_delete=models.CASCADE)
    string_value = models.CharField(max_length=100)
