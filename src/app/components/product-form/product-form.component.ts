import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { VirtualTimeScheduler } from 'rxjs';

import { validatorNumber } from '../../directives/validator-number.directive';
import { ProductsService } from '../../services/products.service';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  productForm = this.fb.group({
    name: this.fb.control('', Validators.required),
    kcal: this.fb.control('', [Validators.required, validatorNumber(/[^0-9]/)])
  });
  @Output() newProductName = new EventEmitter<string>();
  msg: string;
  errorName = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    const productSend = this.productForm.value;
    const name = productSend.name;
    const kcal = productSend.kcal;
    const userId = localStorage.getItem('userId');
    this.productService.createProduct({ name, userId, kcal }).subscribe(res => {
      this.newProductName.emit(res.name);
    },
    err => {
      if (err.status === 400) {
        this.errorName = true;
        this.msg = err.error.message;
      }
    }) ;
  }

  get name() {
    return this.productForm.get('name');
  }

  get kcal() {
    return this.productForm.get('kcal');
  }

}
