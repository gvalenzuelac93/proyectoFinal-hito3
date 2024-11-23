export const searchProducts = async (query) => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();
      
      const searchTerm = query.toLowerCase();
      return products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };
  
  export const sortResults = (results, sortBy = 'relevance') => {
    switch (sortBy) {
      case 'price-low':
        return [...results].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...results].sort((a, b) => b.price - a.price);
      case 'name':
        return [...results].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return results;
    }
  };