import { Component, OnInit, ViewChild } from '@angular/core';
import { TourService } from '../service/tours.service';
import { Tour } from '../model/tour';
import { CommonModule } from '@angular/common';
import { FormsModule ,NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { enviroment } from '../enviroments/enviroments';
import { RouterModule } from '@angular/router';
import { TourCreateDTO } from '../dtos/user/tourDTO/tour-create.dto';  // Import DTO nếu chưa làm
import { QuillModule } from 'ngx-quill';
@Component({
  selector: 'app-quan-ly-tour',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,QuillModule],
  templateUrl: './quan-ly-tour.component.html',
  styleUrls: ['./quan-ly-tour.component.scss']
})
export class QuanLyTourComponent implements OnInit {
  tours: Tour[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  showForm = false;

  showAddImageForm: boolean = false; // Điều khiển hiển thị form thêm ảnh
  selectedFiles: File[] = [];        // Mảng lưu ảnh đã chọn
  selectedTourId: number | null = null;
  uploadedImageUrls: string[] = [];
  // @ViewChild('themTour') registerForm!: NgForm;

  // newTour: TourCreateDTO = {
  //   tour_name: '',
  //   days: 0,
  //   start_date: new Date(),
  //   destination: '',
  //   tour_type: '',
  //   departure_location: '',
  //   status: '',
  //   // thumbnail: '',
  //   price: 0,
  //   description: '',
  //   content: '',
  // };


  constructor(private tourService: TourService, private router: Router) {}

  ngOnInit() {
    this.getTours(this.keyword, this.currentPage, this.itemsPerPage);
  }

  getTours(keyword: string, page: number, limit: number) {
    this.tourService.getTours(keyword, page, limit).subscribe({
      next: (response: any) => {
        if (response && response.tourResponses) {
          this.tours = response.tourResponses.map((tour: Tour) => ({
            ...tour,
            // thumbnailUrl: `${enviroment.apiBaseUrl}/images/${tour.thumbnail}`
          }));
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        } else {
          console.error("Cấu trúc phản hồi từ backend không đúng:", response);
        }
      },
      error: (error: any) => {
        console.error('Lỗi khi lấy dữ liệu tour:', error);
      }
    });
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 0);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getTours(this.keyword, this.currentPage, this.itemsPerPage);
  }

  // onAddTourSubmit() {
  //   this.tourService.addTour(this.newTour).subscribe({
  //     next: () => {
  //       this.showForm = false;
  //       this.getTours(this.keyword, this.currentPage, this.itemsPerPage); // Tải lại danh sách tour
  //     },
  //     error: (error) => {
  //       console.error('Lỗi khi thêm tour:', error);
  //     }
  //   });
  // }
  onFileSelected(event: any): void {
    // Lấy danh sách các tệp đã chọn
    this.selectedFiles = Array.from(event.target.files);
  }
  uploadImages() {
    if (this.selectedTourId !== null && this.selectedFiles.length > 0) {
      this.tourService.uploadImages(this.selectedTourId, this.selectedFiles).subscribe({
        next: (response) => {
          console.log('Uploaded images:', response);
          this.uploadedImageUrls = response.map((image: any) => image.imageUrl);
          this.showAddImageForm = false;
          this.selectedFiles = [];
        },
        error: (error) => {
          console.error('Error uploading images:', error);
        }
      });
    } else {
      console.error('Tour ID or files are missing!');
    }
  }
  

  // Hàm để chọn tourId khi người dùng chọn một tour cụ thể
  selectTour(tourId: number): void {
    this.selectedTourId = tourId;
  }

  cancelAddImage() {
    this.showAddImageForm = false;  // Ẩn form
    this.selectedFiles = [];  // Xóa danh sách tệp đã chọn
 
  }


  toggleAddImageForm() {
    this.showAddImageForm = !this.showAddImageForm;
  }


}
