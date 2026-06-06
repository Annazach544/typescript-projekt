import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class Schedule {
  private storageKey = 'schedule';
  private schedule: Course[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

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
      this.saveToLocalStorage();
    }
  }

  // Tar bort en kurs från ramschemat med hjälp av kurskoden
  removeCourse(courseCode: string): void {
    this.schedule = this.schedule.filter(
      course => course.courseCode !== courseCode
    );

    this.saveToLocalStorage();
  }

  // Räknar ut det totala antalet högskolepoäng för valda kurser
  getTotalPoints(): number {
    return this.schedule.reduce(
      (total, course) => total + course.points,
      0
    );
  }

  // Sparar ramschemat i webbläsarens localStorage
  private saveToLocalStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.schedule));
  }

  // Läser in sparade kurser från localStorage när sidan öppnas
  private loadFromLocalStorage(): void {
    const savedSchedule = localStorage.getItem(this.storageKey);

    if (savedSchedule) {
      this.schedule = JSON.parse(savedSchedule);
    }
  }
}