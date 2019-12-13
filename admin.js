var app = new Vue({
  el: '#admin',
  data: {
    title: "",
	description: "",
    file: null,
    addItem: null,
	price: 0,
	items: [],
	cart: [],
	findTitle: "",
    findItem: null,
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
	selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
	async editItem(item) {
      try {
        let response = await axios.put("http://localhost:8001/items/" + item._id, {
          title: this.findItem.title,
		  itemPrice: this.findItem.itemPrice,
        });
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteItem(item) {
      try {
        let response = axios.delete("http://localhost:8001/items/" + item._id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
	fileChanged(event) {
		this.file = event.target.files[0]
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name);
        let r1 = await axios.post('http://localhost:8001/photos', formData);
        let r2 = await axios.post('http://localhost:8001/items', {
          title: this.title,
		  description: this.description,
		  price: this.price,
          path: r1.data.path
        });
        this.addItem = r2.data;
      } catch (error) {
        console.log(error);
      }
    },
	  
  },
  computed: {
    suggestions() {
      return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    }
  },
  created(){
	  this.getItems();
  },
});
