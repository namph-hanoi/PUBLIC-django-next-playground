import factory
from django.contrib.auth import get_user_model
from factory.django import DjangoModelFactory

User = get_user_model()

class UserFactory(DjangoModelFactory):
    """Factory for generating test users."""
    
    class Meta:
        model = User
        
    username = factory.Sequence(lambda n: f"user_{n}")
    email = factory.LazyAttribute(lambda o: f"{o.username}@example.com")
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    
    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        password = extracted or 'testpass123'
        self.set_password(password)
        if create:
            self.save()

# You can add more factories for your app-specific models here

# Example of related model factories:
# class CategoryFactory(DjangoModelFactory):
#     class Meta:
#         model = Category
#     name = factory.Sequence(lambda n: f"Category {n}")

# class ProductFactory(DjangoModelFactory):
#     class Meta:
#         model = Product
#     name = factory.Sequence(lambda n: f"Product {n}")
#     category = factory.SubFactory(CategoryFactory)
#     price = factory.Faker('pydecimal', left_digits=3, right_digits=2, positive=True)
