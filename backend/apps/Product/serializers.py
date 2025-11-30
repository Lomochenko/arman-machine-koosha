from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['title_fa', 'title_en', 'slug']


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'title_fa', 'title_en', 'short_description_fa', 'short_description_en',
            'photo', 'created_at'
        ]
        read_only_fields = ['created_at']
