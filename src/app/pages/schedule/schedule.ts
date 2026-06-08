import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Schedule as ScheduleService } from '../../services/schedule';

@Component({
  selector: 'app-schedule',
  imports: [CommonModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class Schedule {
  private scheduleService = inject(ScheduleService);

  // Hämtar alla kurser som finns i ramschemat
  selectedCourses() {
    return this.scheduleService.getCourses();
  }

  // Räknar ut det totala antalet högskolepoäng för valda kurser
  totalPoints() {
    return this.scheduleService.getTotalPoints();
  }

  // Tar bort en kurs från schemat
  removeCourse(courseCode: string) {
    this.scheduleService.removeCourse(courseCode);
  }
}