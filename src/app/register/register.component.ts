import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { UserService } from '../service/user.service';
import { RegisterDTO } from '../dtos/user/register.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;

  phone: string = '';
  password: string = '';
  retypePassword: string = '';
  name: string = '';
  address: string = '';
  isAccepted: boolean = false;
  gender: string = '';
  email: string = "ngothanhdat09@gmail.com";
  successMessage: string = '';

  constructor(private router: Router, private userService: UserService) {}

  // Ghi lại giá trị hiện tại của điện thoại mỗi khi nó thay đổi
  onPhoneChange() {
    console.log(`Phone typed: ${this.phone}`);
  }

  // Phương thức đăng ký
  register() {
    const registerDTO:RegisterDTO = {
        name: this.name,
        phone: this.phone,
        gender: this.gender,
        password: this.password,
        retypePassword: this.retypePassword,
        address: this.address,
        email: this.email,
        role_id: 1
    };

    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        this.successMessage = 'Đăng ký thành công!';

        // Xóa các giá trị đã nhập trong form
        this.phone = '';
        this.password = '';
        this.retypePassword = '';
        this.name = '';
        this.address = '';
        this.isAccepted = false;
        this.gender = '';
        this.email = "ngothanhdat09@gmail.com";

        this.registerForm.resetForm(); // Reset form

      },
      error: (error) => {
        const errorMessage = error.error || `Cannot register, error: ${error.message}`;
        alert(errorMessage);
      }
    });
  }

  // Phương thức kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau không
  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({ 'passwordMisMatch': true });
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }
}
