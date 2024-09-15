# Generated by Django 5.1.1 on 2024-09-14 22:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='description',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='listing',
            name='imageURLs',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='listing',
            name='itemCategory',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='listing',
            name='itemName',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='listing',
            name='owner',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='listing',
            name='price',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='listing',
            name='school',
            field=models.CharField(max_length=100),
        ),
    ]