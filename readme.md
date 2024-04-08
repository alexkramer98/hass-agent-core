Op server en development pc: 

- Voeg toe aan "/etc/docker/daemon.json": "insecure-repos": ["server.osso:5000"]
```bash
docker login server.osso:5000
```
