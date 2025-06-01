class CoreHTTP {
  get(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = () => xhr.status === 200 ? resolve(JSON.parse(xhr.responseText)) : reject(xhr.status);
      xhr.onerror = () => reject('Network error');
      xhr.send();
    });
  }

  post(url, data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = () => xhr.status === 201 ? resolve(JSON.parse(xhr.responseText)) : reject(xhr.status);
      xhr.onerror = () => reject('Network error');
      xhr.send(JSON.stringify(data));
    });
  }

  delete(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', url);
      xhr.onload = () => xhr.status === 200 ? resolve(JSON.parse(xhr.responseText)) : reject(xhr.status);
      xhr.onerror = () => reject('Network error');
      xhr.send();
    });
  }

  put(url, data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = () => xhr.status === 200 ? resolve(JSON.parse(xhr.responseText)) : reject(xhr.status);
      xhr.onerror = () => reject('Network error');
      xhr.send(JSON.stringify(data));
    });
  }
}
