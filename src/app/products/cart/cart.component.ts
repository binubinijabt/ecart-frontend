import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

proceedtopay:boolean=false;




//from paypal
  public payPalConfig?: IPayPalConfig;

  //paypal showSuccess
  showSuccess:boolean=false;





offerClick:boolean=false;
discountStatus:boolean=false



  username:any
HouseNumber:any
pincode:any
phone:any
  //to hold payment status
paymentStatus:boolean=false;


  //to hold total price
  totalPrize: number = 0


  //to hold the cart items
  allCarts: any = [];


  constructor(private api: ApiService, private fb: FormBuilder) { }

  
  //validation for making payment button
  addressForm = this.fb.group({
    username: ['',[Validators.required,Validators.pattern('[a-zA-z]*')]],
    housenumber: ['',[Validators.required,Validators.pattern('[0-9]*')]],
    street: ['',[Validators.required,Validators.pattern('[a-zA-z]*')]],
    state: ['',[Validators.required,Validators.pattern('[a-zA-z]*')]],
    pincode: ['',[Validators.required,Validators.pattern('[0-9]*')]],
    mobileNumber: ['',[Validators.required,Validators.pattern('[0-9]*')]]

  })

  ngOnInit(): void {

    this.initConfig();






    this.api.getCart().subscribe((result: any) => {
      console.log(result);//content
      this.allCarts = result
      //call cart total
      this.getCartTotal()

    }
      ,
      (result: any) => {
        console.log(result.error);//error msg

      }
    )
  }

  removeCartItem(id: any) {
    this.api.removeCartItem(id).subscribe((result: any) => {
      console.log(result);

      //remaining cart items added to the allcarts
      this.allCarts = result
      this.api.cartCount()
      this.getCartTotal()

    },

      (result: any) => {
        console.log(result.error);//error message

      })
  }

  //get cart total
  getCartTotal() {
    let total = 0;
    this.allCarts.forEach((item: any) => {
      total = total + item.grandTotal
      this.totalPrize = Math.ceil(total)
    });
  }

  //increment cart
  incrementCart(id: any) {
    this.api.incrementCartCount(id).subscribe((result: any) => {//updated cart details
      this.allCarts = result
      this.getCartTotal()
    },
      (result: any) => {
        alert(result.error)
      }

    )
  }


  //decrement cart
  decrementCart(id: any) {
    this.api.decrementCartCount(id).subscribe((result: any) => {//updated cart details
      this.allCarts = result
      this.getCartTotal()
    },
      (result: any) => {
        alert(result.error)
      }

    )
  }

  submitForm(){
    //check the address is valid
    if(this.addressForm.valid){

      this.paymentStatus=true
this.username=this.addressForm.value.username
this.HouseNumber=this.addressForm.value.housenumber
this.pincode=this.addressForm.value.pincode
this.phone=this.addressForm.value.mobileNumber


    }else{
alert("Please Enter Valid Details")
    }
  }

  offerClicked(){
    this.offerClick=true
    
  }

 discount(value:any){
this.totalPrize = Math.ceil(this.totalPrize*(100-value)/100)
this.offerClick=false
this.discountStatus=true
 }


 makepay(){
  this.proceedtopay=true
 }


 modalclose(){
  this.addressForm.reset()
  this.showSuccess=false
  this.paymentStatus=false
 }








//paypal function

private initConfig(): void {
  this.payPalConfig = {
  currency: 'EUR',
  clientId: 'sb',
  createOrderOnClient: (data) => <ICreateOrderRequest>{
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'EUR',
          value: '9.99',
          breakdown: {
            item_total: {
              currency_code: 'EUR',
              value: '9.99'
            }
          }
        },
        items: [
          {
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: '9.99',
            },
          }
        ]
      }
    ]
  },
  advanced: {
    commit: 'true'
  },
  style: {
    label: 'paypal',
    layout: 'vertical'
  },
  onApprove: (data, actions) => {
    console.log('onApprove - transaction was approved, but not authorized', data, actions);
    actions.order.get().then((details:any) => {
      console.log('onApprove - you can get full order details inside onApprove: ', details);
    });
  },
  onClientAuthorization: (data) => {
    console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
    this.showSuccess = true;
  },
  onCancel: (data, actions) => {
    console.log('OnCancel', data, actions);
  },
  onError: err => {
    console.log('OnError', err);
  },
  onClick: (data, actions) => {
    console.log('onClick', data, actions);
  },
};
}



}
