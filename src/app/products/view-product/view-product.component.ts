import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

//to fetch parameters details
productId:string=""


//to hold particular product details
product:any=[];




constructor(private viewdRoute:ActivatedRoute, private api:ApiService){}

ngOnInit(): void {
  //to fetch parameters
  this.viewdRoute.params.subscribe((result:any)=>{
    console.log(result);//{productId:4}
    console.log(result.productId);//4
    this.productId=result.productId;
    
    //to fetch particular product details
    this.api.viewProduct(this.productId).subscribe((result:any)=>{
      console.log(result);
      this.product=result  //product details

      
    },
    (result:any)=>{
      console.log(result.error);// error message
      
    }
    
    )
    
  })
}

//api function to add product to wishlist

addtowishlist(){
  const{id,title,price,image}=this.product

  //api function
  this.api.addToWishlist(id,title,price,image).subscribe((result:any)=>{
    alert(result);
  },
  (result:any)=>{
    alert(result.error)//error msg
  }
  )
}

addToCart(product:any){
  // add quantity to cart
  Object.assign(product,{quantity:1})
  console.log(product);

  //api call to add quantity
  this.api.addToCart(product).subscribe((result:any)=>{
    //call cart count
    this.api.cartCount()
    alert(result)//added to cart
  },
  (result:any)=>{
    alert(result.error)//error message
  }
  )

  
}


}
