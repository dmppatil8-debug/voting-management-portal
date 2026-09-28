package com.voting.controller;

import com.voting.entity.*;
import com.voting.repository.ElectionRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/elections")
public class ElectionController {

    private final ElectionRepository repo;

    public ElectionController(ElectionRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    List<Election> all() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    Election one(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    @PostMapping
    Election create(@RequestBody Election e) {
        e.setId(null);
        return repo.save(e);
    }

    @PutMapping("/{id}")
    Election update(
            @PathVariable Long id,
            @RequestBody Election input
    ) {
        Election e = repo.findById(id).orElseThrow();

        e.setTitle(input.getTitle());
        e.setDescription(input.getDescription());
        e.setStatus(input.getStatus());
        e.setStartTime(input.getStartTime());
        e.setEndTime(input.getEndTime());

        return repo.save(e);
    }

    @DeleteMapping("/{id}")
    void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}