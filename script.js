var app = new Vue({
  el: '#app',
  data: {
	  title: "",
	  description: "",
	  price: "",
	  path: "",
	  items: [],
	  cart: [],
  },
  methods: {
	  async getItems() {
      try {
        let response = await axios.get("http://localhost:8001/items");
        this.items = response.data;
		console.log(this.items);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
	 async getCart() {
      try {
        let response = await axios.get("http://localhost:8001/carts");
        this.cart = response.data;
		console.log(this.cart);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
	async uploadToCart(item) {
      try {
        let r2 = await axios.post('http://localhost:8001/carts', {
          title: item.title,
		  description: item.description,
		  price: item.price,
          path: item.path
        });
      } catch (error) {
        console.log(error);
      }
    },
	async deleteCartItem(cart) {
      try {
        let response = axios.delete("http://localhost:8001/carts/" + cart._id);
        this.getCart();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  created(){
	  this.getItems();
	  this.getCart();
  },
});