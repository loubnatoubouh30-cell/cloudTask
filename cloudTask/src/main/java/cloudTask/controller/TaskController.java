package cloudtask.controller;

import cloudtask.model.Task;
import cloudtask.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Tâche non trouvée avec l'id : " + id);
        }
        taskRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée avec l'id : " + id));

        task.setTitle(taskDetails.getTitle());
        task.setCompleted(taskDetails.isCompleted());
        task.setPriority(taskDetails.getPriority());
        task.setDueDate(taskDetails.getDueDate());
        task.setAssignedUser(taskDetails.getAssignedUser()); // Sécurité bonus pour la mise à jour de l'assignation

        return taskRepository.save(task);
    }

    // Route pour filtrer par priorité : /api/tasks/priority/1
    @GetMapping("/priority/{priority}")
    public List<Task> getTasksByPriority(@PathVariable int priority) {
        return taskRepository.findByPriority(priority);
    }

    // Route pour filtrer par statut : /api/tasks/completed/true ou /false
    @GetMapping("/completed/{status}")
    public List<Task> getTasksByCompletedStatus(@PathVariable boolean status) {
        return taskRepository.findByCompleted(status);
    }

    // Récupérer les tâches d'un utilisateur spécifique par son ID
    @GetMapping("/user/{userId}")
    public List<Task> getTasksByUser(@PathVariable Long userId) {
        return taskRepository.findByAssignedUserId(userId);
    }

    // NOUVELLE ROUTE : Rechercher les tâches par nom d'utilisateur (recherche partielle)
    @GetMapping("/search/user")
    public List<Task> getTasksByUsername(@RequestParam String username) {
        return taskRepository.findByAssignedUserUsernameContainingIgnoreCase(username);
    }



    @GetMapping("/sorted/date")
    public List<Task> getTasksSortedByDate() {
        return taskRepository.findByDueDateIsNotNullOrderByDueDateAsc();
    }
}
