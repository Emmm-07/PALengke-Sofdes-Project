# Generated by Django 5.0.6 on 2024-07-03 11:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_alter_market_item_img_alter_market_map_img'),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('admin_id', models.CharField(max_length=50)),
                ('admin_password', models.CharField(max_length=128)),
            ],
        ),
        migrations.AlterField(
            model_name='market',
            name='map_img',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
