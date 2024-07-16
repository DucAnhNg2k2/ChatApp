import { Observable } from 'rxjs';

const toPromise = <T>(observable: Observable<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    const subscription = observable.subscribe({
      next: (value) => {
        resolve(value);
        subscription.unsubscribe();
      },
      error: (err) => {
        reject(err);
        subscription.unsubscribe();
      },
    });
  });
};

export { toPromise };
