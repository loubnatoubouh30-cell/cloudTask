package cloudtask.repository;

import cloudtask.model.Task;
import cloudtask.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Requête explicite pour éviter les erreurs de syntaxe Spring Data JPA
    @Query("SELECT t FROM Task t WHERE t.assignedUser.id = :userId")
    List<Task> findByAssignedUserId(@Param("userId") Long userId);

    // Optionnel : Trouver par nom d'utilisateur (username)
    List<Task> findByAssignedUserUsername(String username);

    // Pour trier automatiquement par date d'échéance croissante
    List<Task> findAllByOrderByDueDateAsc();

    // Pour trier par priorité
    List<Task> findAllByOrderByPriorityAsc();

    // Permet de trouver toutes les tâches ayant une priorité spécifique
    List<Task> findByPriority(int priority);

    // Permet de trouver toutes les tâches selon leur statut (terminée ou non)
    List<Task> findByCompleted(boolean completed);

    // Recherche partielle par nom d'utilisateur (insensible à la casse)
    List<Task> findByAssignedUserUsernameContainingIgnoreCase(String username);

    // Récupérer uniquement les tâches qui ont une date d'échéance, triées par ordre croissant
    @Query("SELECT t FROM Task t WHERE t.dueDate IS NOT NULL ORDER BY t.dueDate ASC")
    List<Task> findByDueDateIsNotNullOrderByDueDateAsc();
}

