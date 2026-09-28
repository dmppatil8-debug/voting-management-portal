package com.voting.controller;
import com.voting.entity.*; import com.voting.repository.*; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/candidates") public class CandidateController { private final CandidateRepository candidates; private final ElectionRepository elections; public CandidateController(CandidateRepository c,ElectionRepository e){candidates=c;elections=e;}
 @GetMapping("/election/{electionId}") List<Candidate> byElection(@PathVariable Long electionId){return candidates.findByElectionId(electionId);}
 @PostMapping Candidate create(@RequestBody Candidate c){Election e=elections.findById(c.getElection().getId()).orElseThrow();c.setId(null);c.setElection(e);return candidates.save(c);}
 @DeleteMapping("/{id}") void delete(@PathVariable Long id){candidates.deleteById(id);}
}
