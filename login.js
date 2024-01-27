import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.14/vue.esm-browser.min.js';
let app={
    data(){
        return{
            apiUrl:'https://ec-course-api.hexschool.io/v2',
            userInfo:{
                username:"",
                password:""
            }
        };
    },
    methods:{
      login(){
        const api=`${this.apiUrl}/admin/signin`;
        axios.post(api,this.userInfo)
        .then((res)=>{
           console.log(res);
           const {token,expired}=res.data;
           document.cookie=`myToken=${token};expires=${new Date(expired)};path=/`;
           window.location='./products.html';
        })
        .catch((err)=>{
           alert(err.data.message);
        });
      }
    }
};
createApp(app).mount('#app');