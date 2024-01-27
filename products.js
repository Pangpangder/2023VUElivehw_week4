import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.14/vue.esm-browser.min.js';
let myProductModal='';
let myDelModal='';
const app=createApp({
  data(){
    return{
     apiUrl:'https://ec-course-api.hexschool.io/v2',
     api_path:'pangpang',
     products:[],
     isNew:false,
     tempProduct:{
        imagesUrl:[]
     },
     pagination:{}
    };
  },
  mounted(){
   const token=document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
   axios.defaults.headers.common.Authorization = token;
   this.checkLogin();
  },
  methods:{
    checkLogin(){
      const url=`${this.apiUrl}/api/user/check`;
      axios.post(url)
      .then((res)=>{
         this.getProducts();
      })
      .catch((err)=>{
        console.dir(err);
        alert(err.data.message);
        window.location='./login.html';
      });
    },
    openModal(identify,item){
       if(identify==='add'){
         this.tempProduct={
            imagesUrl:[]
         };
         this.isNew=true;
         myProductModal.show();
       }else if(identify==='edit'){
         this.tempProduct={...item};
         this.isNew=false;
         myProductModal.show();
       }else if(identify==='del'){
        this.tempProduct={...item}
         myDelModal.show();
       }
    },
    getProducts(page=1){
      const url=`${this.apiUrl}/api/${this.api_path}/admin/products?page=${page}`;
      axios.get(url)
      .then((res)=>{
         const {pagination,products}=res.data;
         this.products=products;
         this.pagination=pagination;
      })
      .catch((err)=>{
        alert(err.response.message);
      });
    }
  }
});

//分頁元件
app.component('pagination',{
  template:'#pagination',
  props:['pages'],
  methods:{
    emitPageNum(num){
      this.$emit('emit-page',num);
    }
  }
});

//產品新增及更新元件
app.component('productModal',{
  template:'#productModal',
  props:['tempProduct','isNew'],
  data(){
    return{
      apiUrl:'https://ec-course-api.hexschool.io/v2',
      api_path:'pangpang'
    }
  },
  mounted(){
     const productModal=document.querySelector('#productModal');
     myProductModal = new bootstrap.Modal(productModal,{
     keyboard: false,
     backdrop: 'static'
  });
  },
  methods:{
    addProduct(){
      let url=`${this.apiUrl}/api/${this.api_path}/admin/product`;
      axios.post(url,{
        data:this.tempProduct
      })
      .then((res)=>{
         alert(res.data.message);
         myProductModal.hide();
         this.$emit('addProducts');
      })
      .catch((err)=>{
        let str='';
        err.data.message.forEach((item) => {
            str+=item;
        });
        alert(str);
      });
    },
    editProduct(){
      const id=this.tempProduct.id;
      const url=`${this.apiUrl}/api/${this.api_path}/admin/product/${id}`;
      const obj={
        data:this.tempProduct
      }
      axios.put(url,obj)
      .then((res)=>{
        alert(res.data.message);
        myProductModal.hide();
        this.$emit('editProduct');
      })
      .catch((err)=>{
         console.dir(err);
         let str='';
          err.data.message.forEach((item) => {
            str+=item;
          });
          alert(str);
      });
    },
    createImgList(){
      this.tempProduct.imagesUrl=[];
      this.tempProduct.imagesUrl.push('');
    }
  }
}
);

//刪除元件
app.component('delProductModal',{
  template:'#delProductModal',
  props:['delItem'],
  mounted(){
     const delProductModal=document.querySelector('#delProductModal');
     myDelModal=new bootstrap.Modal(delProductModal,{
       keyboard: false,
       backdrop: 'static'
     });
  },
  data(){
    return{
      apiUrl:'https://ec-course-api.hexschool.io/v2',
      api_path:'pangpang'
    }
  },
  methods:{
    delProduct(){
     const id =this.delItem.id;
     const url=`${this.apiUrl}/api/${this.api_path}/admin/product/${id}`;
     axios.delete(url)
     .then((res)=>{
       console.log(res);
       alert(res.data.message);
       myDelModal.hide();
       this.$emit('delProduct');
     })
     .catch((err)=>{
         alert(err.data.message);
         myDelModal.hide();
     });
    }
  }
});
app.mount('#app');