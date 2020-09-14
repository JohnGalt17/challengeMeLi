import http from 'k6/http';

export default function () {
  var url = 'http://localhost:8080/api/mutant2';
  var payload = JSON.stringify({ "dna":  [
                "ATGCGA",
                "CACTGC",
                "TTATAT",
                "CGAAGG",
                "CCGCTA",
                "TCACTG"
            ] });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
}