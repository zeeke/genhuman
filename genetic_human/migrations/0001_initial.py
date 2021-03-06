# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2016-11-11 22:52
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Algorithm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('template', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='AlgorithmOptions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('population_size', models.IntegerField(default=20)),
            ],
        ),
        migrations.CreateModel(
            name='Gene',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('gene_type', models.CharField(max_length=50)),
                ('algorithm', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='genetic_human.Algorithm')),
            ],
        ),
        migrations.CreateModel(
            name='Generation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.IntegerField()),
                ('algorithm', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='genetic_human.Algorithm')),
            ],
        ),
        migrations.CreateModel(
            name='Genoma',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('string_value', models.CharField(max_length=100)),
                ('gene', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='genetic_human.Gene')),
            ],
        ),
        migrations.CreateModel(
            name='Individual',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fitness_value', models.FloatField()),
                ('algorithm', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='genetic_human.Algorithm')),
            ],
        ),
        migrations.AddField(
            model_name='genoma',
            name='individual',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='genetic_human.Individual'),
        ),
        migrations.AddField(
            model_name='generation',
            name='individuals',
            field=models.ManyToManyField(to='genetic_human.Individual'),
        ),
        migrations.AddField(
            model_name='algorithm',
            name='options',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='genetic_human.AlgorithmOptions'),
        ),
    ]
