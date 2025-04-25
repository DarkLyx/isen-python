from django.test import TestCase
from django.urls import reverse
from products.models import Product

class HomeViewTests(TestCase):
    def setUp(self):
        # Création de produits de test
        Product.objects.create(name="Produit A", price=10.0, description="Premier produit", image="image1.jpg")
        Product.objects.create(name="Produit B", price=20.0, description="Deuxième produit", image="image2.jpg")
        Product.objects.create(name="Produit C", price=30.0, description="Troisième produit", image="image3.jpg")

    def test_home_view_status_code(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)

    def test_filter_by_min_price(self):
        response = self.client.get(reverse('home'), {'min_price': '15'})
        self.assertContains(response, "Produit B")
        self.assertContains(response, "Produit C")
        self.assertNotContains(response, "Produit A")

    def test_filter_by_max_price(self):
        response = self.client.get(reverse('home'), {'max_price': '20'})
        self.assertContains(response, "Produit A")
        self.assertContains(response, "Produit B")
        self.assertNotContains(response, "Produit C")

    def test_filter_by_min_and_max_price(self):
        response = self.client.get(reverse('home'), {'min_price': '11', 'max_price': '29'})
        self.assertContains(response, "Produit B")
        self.assertNotContains(response, "Produit A")
        self.assertNotContains(response, "Produit C")

    def test_sort_by_price_ascending(self):
        response = self.client.get(reverse('home'), {'order_by': 'asc'})
        products = list(response.context['object_list'])
        self.assertEqual(products[0].price, 10.0)
        self.assertEqual(products[1].price, 20.0)
        self.assertEqual(products[2].price, 30.0)

    def test_sort_by_price_descending(self):
        response = self.client.get(reverse('home'), {'order_by': 'desc'})
        products = list(response.context['object_list'])
        self.assertEqual(products[0].price, 30.0)
        self.assertEqual(products[1].price, 20.0)
        self.assertEqual(products[2].price, 10.0)
