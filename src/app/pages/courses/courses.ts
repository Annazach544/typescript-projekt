import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { Schedule } from '../../services/schedule';
import { toSignal } from '@angular/core/rxjs-interop';
import { Course } from '../../models/course.model';

type SortKey = 'courseCode' | 'courseName' | 'progression' | 'points' | 'subject';

@Component({
  selector: 'app-courses',
  imports: [CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  searchTerm = signal('');
  selectedSubject = signal('');

  private courseService = inject(CourseService);
  private scheduleService = inject(Schedule);

  courses = toSignal(this.courseService.getCourses(), {
    initialValue: []
  });

  sortKey = signal<SortKey>('courseCode');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Skapar en lista över unika ämnen från kurserna för att använda i filter
  subjects = computed(() => {
    const allSubjects = this.courses().map(course => course.subject);
    return [...new Set(allSubjects)].sort();
  });

  // Filtrerar och sorterar kurser baserat på sökterm, valt ämne och sorteringsinställningar
  sortedCourses = computed(() => {
    const term = this.searchTerm().toLowerCase();

    const filtered = this.courses().filter(course => {
      const matchesSearch =
        course.courseCode.toLowerCase().includes(term) ||
        course.courseName.toLowerCase().includes(term);

      const matchesSubject =
        this.selectedSubject() === '' ||
        course.subject === this.selectedSubject();

      return matchesSearch && matchesSubject;
    });

    return filtered.sort((a, b) => {
      const key = this.sortKey();

      if (a[key] < b[key]) return this.sortDirection() === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return this.sortDirection() === 'asc' ? 1 : -1;
      return 0;
    });
  });

  setSort(key: SortKey) {
    if (this.sortKey() === key) {
      this.sortDirection.set(
        this.sortDirection() === 'asc' ? 'desc' : 'asc'
      );
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }
  }

  // Lägger till en kurs i schemat
  addCourse(course: Course) {
    this.scheduleService.addCourse(course);
  }
}