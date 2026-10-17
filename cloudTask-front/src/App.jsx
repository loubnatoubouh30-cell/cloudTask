import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  getTasksByPriority,
  getTasksByCompletedStatus,
  getUsers,
  loginUser,
  registerUser,
  getTasksByUsername,
  getTasksSortedByDate
} from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(1);
  const [dueDate, setDueDate] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [searchUsername, setSearchUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const [isRegistering, setIsRegistering] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [roleInput, setRoleInput] = useState('MEMBRE');
  const [authError, setAuthError] = useState('');

  const loadData = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);

      const usersData = await getUsers();
      setUsers(usersData);
      if (usersData.length > 0 && !assignedUserId) {
        setAssignedUserId(usersData[0].id);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const isManager = currentUser.role && currentUser.role.toUpperCase().includes('CHEF');
      const targetUserId = isManager ? assignedUserId : currentUser.id;

      await createTask({
        title: title.trim(),
        completed: false,
        priority: Number(priority),
        dueDate: dueDate || null,
        assignedUser: targetUserId ? { id: Number(targetUserId) } : null
      });
      setTitle('');
      setPriority(1);
      setDueDate('');
      loadData();
    } catch (error) {
      console.error("Erreur de création :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      loadData();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // Fonction pour supprimer un utilisateur (visible par le manager)
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      loadData();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      alert("Impossible de supprimer cet utilisateur (il possède peut-être des tâches actives).");
    }
  };

  const handleToggleComplete = async (task) => {
    const isManager = currentUser.role && currentUser.role.toUpperCase().includes('CHEF');
    const isAssignedToMe = task.assignedUser && task.assignedUser.id === currentUser.id;

    if (!isManager && !isAssignedToMe) {
      alert("Vous ne pouvez modifier que les tâches qui vous sont assignées.");
      return;
    }

    try {
      await updateTask(task.id, {
        ...task,
        completed: !task.completed
      });
      loadData();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleFilterChange = async (type) => {
    setFilter(type);
    setSearchUsername('');
    try {
      let data = [];
      if (type === 'COMPLETED') {
        data = await getTasksByCompletedStatus(true);
      } else if (type === 'ACTIVE') {
        data = await getTasksByCompletedStatus(false);
      } else if (type === 'HIGH_PRIORITY') {
        data = await getTasksByPriority(1);
      } else if (type === 'DATE') {
        data = await getTasksSortedByDate();
      } else {
        data = await getTasks();
      }
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur de filtrage :", error);
      setTasks([]);
    }
  };

  const handleSearchByUser = async (e) => {
    const username = e.target.value;
    setSearchUsername(username);

    if (!username.trim()) {
      loadData();
      return;
    }

    try {
      const data = await getTasksByUsername(username);
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur lors de la recherche par utilisateur :", error);
      setTasks([]);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const loggedUser = await loginUser({
        username: usernameInput.trim(),
        password: passwordInput
      });
      setCurrentUser(loggedUser);
      loadData();
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setAuthError("Nom d'utilisateur ou mot de passe incorrect.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const newUser = await registerUser({
        username: usernameInput.trim(),
        password: passwordInput,
        role: roleInput
      });
      setCurrentUser(newUser);
      loadData();
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      setAuthError("Erreur lors de l'inscription (Ce nom existe peut-être déjà).");
    }
  };

  if (!currentUser) {
    return (
      <div className="login-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a', color: '#f8fafc' }}>
        <div style={{ background: '#1e293b', padding: '30px', borderRadius: '12px', border: '1px solid #334155', width: '380px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px' }}>
            {isRegistering ? "cloudTask - Inscription" : "cloudTask - Connexion"}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px' }}>
            {isRegistering ? "Créez votre compte pour commencer :" : "Entrez vos identifiants pour vous connecter :"}
          </p>

          <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569' }}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569' }}
              required
            />

            {isRegistering && (
              <select
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569' }}
              >
                <option value="MEMBRE">Membre</option>
                <option value="CHEF_DE_PROJET">Chef de Projet</option>
              </select>
            )}

            <button
              type="submit"
              style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isRegistering ? "S'inscrire" : "Se connecter"}
            </button>
          </form>

          {authError && (
            <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '15px' }}>{authError}</p>
          )}

          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '20px' }}>
            {isRegistering ? "Vous avez déjà un compte ?" : "Pas encore de compte ?"}
            <span
              onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }}
              style={{ color: '#38bdf8', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }}
            >
              {isRegistering ? "Se connecter" : "S'inscrire"}
            </span>
          </p>
        </div>
      </div>
    );
  }

  const isManager = currentUser.role && currentUser.role.toUpperCase().includes('CHEF');

  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1>Gestion des Tâches - cloudTask</h1>
            <p className="subtitle">Pilotez vos projets cloud avec élégance</p>
          </div>
          <div style={{ background: '#1e293b', padding: '8px 15px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
              👤 <strong>{currentUser.username}</strong> <span style={{ color: '#38bdf8' }}>({currentUser.role})</span>
            </span>
            <button
              onClick={() => setCurrentUser(null)}
              style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Tableau de bord manager avec option de suppression des utilisateurs */}
      {isManager && (
        <div className="progress-dashboard">
          <h3>📊 Suivi de l'avancement de l'équipe</h3>
          <div className="dashboard-grid">
            {users.map(user => {
              const userTasks = tasks.filter(t => t.assignedUser?.id === user.id);
              const completedTasks = userTasks.filter(t => t.completed);
              const percentage = userTasks.length > 0
                ? Math.round((completedTasks.length / userTasks.length) * 100)
                : 0;

              return (
                <div key={user.id} className="user-progress-card">
                  <div className="user-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>👤 {user.username}</strong>
                      <span className="user-role">({user.role})</span>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                      title="Supprimer cet utilisateur"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="progress-stats">
                    <span>{completedTasks.length} / {userTasks.length} terminées</span>
                    <span className="progress-percentage">{percentage}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Formulaire d'ajout de tâche */}
      <form onSubmit={handleCreate} className="task-form">
        <input
          type="text"
          placeholder={isManager ? "Nouvelle tâche pour l'équipe..." : "Nouvelle tâche personnelle..."}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="task-input"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="1">Priorité : Haute (1)</option>
          <option value="2">Priorité : Moyenne (2)</option>
          <option value="3">Priorité : Basse (3)</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569' }}
        />

        {isManager && (
          <select
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            className="user-select"
          >
            <option value="">-- Assigner à un membre --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
        )}

        <button type="submit" className="btn-add">Ajouter</button>
      </form>

      {/* Barre de filtres et de recherche */}
      <div className="filters-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <button className={filter === 'ALL' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterChange('ALL')}>Toutes</button>
        <button className={filter === 'ACTIVE' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterChange('ACTIVE')}>À faire</button>
        <button className={filter === 'COMPLETED' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterChange('COMPLETED')}>Terminées</button>
        <button className={filter === 'HIGH_PRIORITY' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterChange('HIGH_PRIORITY')}>Urgentes (P1)</button>
        <button className={filter === 'DATE' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterChange('DATE')}>📅 Par Date</button>

        <input
          type="text"
          placeholder="🔍 Filtrer par utilisateur..."
          value={searchUsername}
          onChange={handleSearchByUser}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            background: '#0f172a',
            color: '#fff',
            border: '1px solid #475569',
            marginLeft: 'auto',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
      </div>

      {/* Liste des tâches */}
      <div className="task-list-container">
        {tasks.length === 0 ? (
          <p className="no-tasks">Aucune tâche trouvée.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => {
              const isAssignedToMe = task.assignedUser && task.assignedUser.id === currentUser.id;
              const canModify = isManager || isAssignedToMe;

              return (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-info">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      disabled={!canModify}
                      style={{ cursor: canModify ? 'pointer' : 'not-allowed', opacity: canModify ? 1 : 0.4 }}
                      className="task-checkbox"
                    />
                    <span className="task-title">{task.title}</span>

                    {task.assignedUser && (
                      <span className="assigned-user-badge" style={{ background: '#334155', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#38bdf8', marginLeft: '10px' }}>
                        👤 {task.assignedUser.username}
                      </span>
                    )}

                    {task.dueDate && (
                      <span className="due-date-badge" style={{ background: '#334155', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#facc15', marginLeft: '5px' }}>
                        📅 {task.dueDate}
                      </span>
                    )}

                    <span className={`priority-badge p-${task.priority}`} style={{ marginLeft: '10px' }}>
                      {task.priority === 1 ? 'Haute' : task.priority === 2 ? 'Moyenne' : 'Basse'}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(task.id)} className="btn-delete">Supprimer</button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;