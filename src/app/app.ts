import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from './services/course.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Schedule } from './services/schedule';

type SortKey = 'courseCode' | 'courseName' | 'progression' | 'points' | 'subject';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  searchTerm = signal('');
  selectedSubject = signal('');

  private courseService = inject(CourseService);
  private scheduleService = inject(Schedule);

  courses = toSignal(this.courseService.getCourses(), {
    initialValue: []
  });

  sortKey = signal<SortKey>('courseCode');
  sortDirection = signal<'asc' | 'desc'>('asc');

  //Skapar en lista med unika ämnen till ämnesfiltret
  subjects = computed(() => {
    const allSubjects = this.courses().map(course => course.subject);
    return [...new Set(allSubjects)].sort();
  });

  // Filtrerar och sorterar kurser baserat på sökterm, valt ämne, sorteringsnyckel och sorteringsriktning
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

  // Lägger till vald kurs i ramschema 
  addCourse(course: any) {
  this.scheduleService.addCourse(course);
}
selectedCourses() {
  return this.scheduleService.getCourses();
}

totalPoints() {
  return this.scheduleService.getTotalPoints();
}

removeCourse(courseCode: string) {
  this.scheduleService.removeCourse(courseCode);
}
}
