package com.voting.controller;
import com.voting.repository.*; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/results") public class ResultController { private final CandidateRepository candidates; private final VoteRepository votes; public ResultController(CandidateRepository c,VoteRepository v){candidates=c;votes=v;}
 @GetMapping("/{electionId}") List<Map<String,Object>> results(@PathVariable Long electionId){return candidates.findByElectionId(electionId).stream().map(c->Map.<String,Object>of("candidateId",c.getId(),"name",c.getName(),"votes",votes.countByCandidateId(c.getId()))).toList();}
}
