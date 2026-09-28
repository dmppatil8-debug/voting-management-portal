package com.voting.repository;
import com.voting.entity.Vote; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface VoteRepository extends JpaRepository<Vote,Long> { boolean existsByVoterIdAndElectionId(Long voterId,Long electionId); long countByCandidateId(Long candidateId); }
