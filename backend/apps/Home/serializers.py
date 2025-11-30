from rest_framework import serializers
from .models import FirstContent, Manager, WhyUs, Client, Footer


class FirstContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FirstContent
        fields = [
            "title_fa", "title_en",
            "description_fa", "description_en",
            "since",
            "photo",
        ]
        extra_kwargs = {
            'photo': {'required': False},
        }

    # def create(self, validated_data):
    #     """ایجاد جدید - direct assignment"""
    #     # مستقیم از validated_data ایجاد کن
    #     # modeltranslation خودکار _fa و _en رو مدیریت می‌کنه
    #     instance = FirstContent(
    #         title_fa=validated_data.get('title_fa', ''),
    #         title_en=validated_data.get('title_en', ''),
    #         description_fa=validated_data.get('description_fa', ''),
    #         description_en=validated_data.get('description_en', ''),
    #         since=validated_data.get('since', ''),
    #         photo=validated_data.get('photo'),
    #         is_active=validated_data.get('is_active', False)
    #     )
    #     instance.save()
    #     return instance
    #
    # def update(self, instance, validated_data):
    #     """ویرایش - direct assignment"""
    #     if 'title_fa' in validated_data:
    #         instance.title_fa = validated_data['title_fa']
    #
    #     if 'title_en' in validated_data:
    #         instance.title_en = validated_data['title_en']
    #
    #     if 'description_fa' in validated_data:
    #         instance.description_fa = validated_data['description_fa']
    #
    #     if 'description_en' in validated_data:
    #         instance.description_en = validated_data['description_en']
    #
    #     if 'since' in validated_data:
    #         instance.since = validated_data['since']
    #
    #     if 'photo' in validated_data:
    #         instance.photo = validated_data['photo']
    #
    #     if 'is_active' in validated_data:
    #         instance.is_active = validated_data['is_active']
    #
    #     instance.save()
    #     return instance


class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = [
            "title_fa", "title_en",
            "since_fa", "since_en",
            "photo",
        ]
        extra_kwargs = {
            'photo': {'required': False},
        }


class WhyUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyUs
        fields = [
            "title_fa", "title_en",
            "description_fa", "description_en",
            "icon",
        ]


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            "title",
            "photo",
        ]
        extra_kwargs = {
            'photo': {'required': False},
        }


class FooterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Footer
        fields = [
            "telegram",
            "instagram",
            "whatsapp",
            "office_phone",
            "phone",
            "is_active",
        ]
        extra_kwargs = {
            'photo': {'required': False},
        }
