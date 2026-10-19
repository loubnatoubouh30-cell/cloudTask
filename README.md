# ☁️ CloudTask

> Application web de gestion de tâches développée avec **Spring Boot** (Backend) et **React / Vite** (Frontend), connectée à une base de données **MySQL**.

---

## 🚀 À propos du projet

**CloudTask** est un projet académique réalisé dans le cadre du Master en Génie Logiciel pour le Cloud Computing (GLCC).

L'objectif est de faire évoluer progressivement l'application vers une architecture cloud : conteneurisation, CI/CD et déploiement. L'avancement est détaillé dans la [roadmap](#️-roadmap).

---

## 🛠️ Architecture & Technologies

* **Backend :** Java Spring Boot (REST API, Spring Data JPA, Hibernate)
* **Frontend :** React, Vite, JavaScript / CSS
* **Base de données :** MySQL
* **Configuration :** secrets isolés dans un fichier local ignoré par Git

---

## 📁 Structure

```
cloudTask/
├── cloudTask/         # Backend Spring Boot
└── cloudTask-front/   # Frontend React (Vite)
```

---

## ⚙️ Prérequis

* **JDK 21** ou supérieur
* **Node.js** v18+
* **MySQL** (instance locale)

---

## 📥 Installation et lancement local

### 1. Cloner le dépôt

```bash
git clone https://github.com/loubnatoubouh30-cell/cloudTask.git
cd cloudTask
```

### 2. Créer la base de données

```sql
CREATE DATABASE cloudtask_db;
```

### 3. Configurer le backend

```bash
cd cloudTask/src/main/resources
copy application-local.properties.example application-local.properties
```

Renseigner ses identifiants MySQL dans `application-local.properties` (fichier non versionné) :

```properties
spring.datasource.username=votre_utilisateur
spring.datasource.password=votre_mot_de_passe
```

### 4. Lancer le backend

```bash
cd cloudTask
./mvnw spring-boot:run
```

API disponible sur `http://localhost:8080`.

### 5. Lancer le frontend

```bash
cd cloudTask-front
npm install
npm run dev
```

Application disponible sur `http://localhost:5173`.

---

## 🗺️ Roadmap

- [x] Backend Spring Boot + MySQL
- [x] Frontend React
- [x] Secrets externalisés (hors du dépôt)
- [ ] Hachage des mots de passe (Spring Security + BCrypt)
- [ ] Conteneurisation (Docker, docker-compose)
- [ ] CI/CD (GitHub Actions)
- [ ] Déploiement cloud (AWS)

---

## 👤 Auteur

**Loubna Toubouh**