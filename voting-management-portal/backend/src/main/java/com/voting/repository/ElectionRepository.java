package com.voting.repository;
import com.voting.entity.Election; import org.springframework.data.jpa.repository.JpaRepository;
public interface ElectionRepository extends JpaRepository<Election,Long> {}
