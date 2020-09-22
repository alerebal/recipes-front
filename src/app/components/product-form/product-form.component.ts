import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { validatorNumber } from '../../directives/validator-number.directive';
import { Product } from '../../interfaces/Product';
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
  @Output() productEdit = new EventEmitter<boolean>();

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
    this.productService.createProduct({ name, kcal }).subscribe(res => {
      this.productEdit.emit(true);
    });
  }

  get name() {
    return this.productForm.get('name');
  }

  get kcal() {
    return this.productForm.get('kcal');
  }

}
