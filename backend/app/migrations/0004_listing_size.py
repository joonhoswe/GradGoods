# Generated by Django 5.1.1 on 2024-09-15 05:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_listing_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='size',
            field=models.CharField(default='N/A', max_length=20),
        ),
    ]
