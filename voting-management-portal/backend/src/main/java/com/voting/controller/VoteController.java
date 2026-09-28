package com.voting.controller;

import com.voting.entity.*;
import com.voting.repository.*;

import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    private final VoteRepository votes;
    private final UserRepository users;
    private final ElectionRepository elections;
    private final CandidateRepository candidates;

    public VoteController(
            VoteRepository v,
            UserRepository u,
            ElectionRepository e,
            CandidateRepository c
    ) {
        votes = v;
        users = u;
        elections = e;
        candidates = c;
    }

    @GetMapping("/status/{electionId}")
    ResponseEntity<?> voteStatus(
            @PathVariable Long electionId,
            Authentication auth
    ) {
        User voter = users.findByEmail(auth.getName()).orElseThrow();

        boolean hasVoted =
                votes.existsByVoterIdAndElectionId(
                        voter.getId(),
                        electionId
                );

        return ResponseEntity.ok(
                Map.of("hasVoted", hasVoted)
        );
    }

    @PostMapping
    ResponseEntity<?> vote(
            @RequestBody Map<String, Long> body,
            Authentication auth
    ) {
        Long electionId = body.get("electionId");
        Long candidateId = body.get("candidateId");

        User voter =
                users.findByEmail(auth.getName()).orElseThrow();

        Election election =
                elections.findById(electionId).orElseThrow();

        Candidate candidate =
                candidates.findById(candidateId).orElseThrow();

        if (election.getStatus() != ElectionStatus.ACTIVE) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Election is not active"));
        }

        if (!candidate.getElection().getId().equals(electionId)) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            "Candidate does not belong to election"
                    ));
        }

        if (votes.existsByVoterIdAndElectionId(
                voter.getId(),
                electionId
        )) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "error",
                            "You have already voted"
                    ));
        }

        Vote v = new Vote();

        v.setVoter(voter);
        v.setElection(election);
        v.setCandidate(candidate);
        v.setVotedAt(LocalDateTime.now());

        votes.save(v);

        return ResponseEntity.ok(
                Map.of("message", "Vote recorded")
        );
    }
}