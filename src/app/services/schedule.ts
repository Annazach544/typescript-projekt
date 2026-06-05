import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class Schedule {

  // Array som innehåller kurser som användaren har lagt till i ramschemat
  private schedule: Course[] = [];

  // Returnerar alla kurser som finns i ramschemat
  getCourses(): Course[] {
    return this.schedule;
  }

  // Lägger till en kurs om den inte redan finns i ramschemat
  addCourse(course: Course): void {
    const exists = this.schedule.find(
      c => c.courseCode === course.courseCode
    );

    if (!exists) {
      this.schedule.push(course);
    }
  }

  // Tar bort en kurs från ramschemat med hjälp av kurskoden
  removeCourse(courseCode: string): void {
    this.schedule = this.schedule.filter(
      course => course.courseCode !== courseCode
    );
  }

  // Räknar ut det totala antalet högskolepoäng för valda kurser
  getTotalPoints(): number {
    return this.schedule.reduce(
      (total, course) => total + course.points,
      0
    );
  }
}