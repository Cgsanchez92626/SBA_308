function calculateWeightedAverage(assignments, submissions) {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  assignments.forEach(assignment => {
      const submission = submissions.find(sub => sub.assignment_id === assignment.id);
      if (submission) {
          let score = submission.submission.score;
          if (submission.submission.submitted_at > assignment.due_at) {
              // If late, deduct 10% of the submission score
              score *= 0.9;
          }
          totalWeightedScore += score;
          totalWeight += assignment.points_possible;
      }
  });

  if (totalWeight === 0) {
      return 0; // to avoid division by zero
  }

  return (totalWeightedScore / totalWeight) * 100;
}

function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
  const { assignments } = assignmentGroup;

  const learnerData = [];

  learnerSubmissions.forEach(submission => {
      const learnerId = submission.learner_id;
      const weightedAverages = {};

      const learnerAssignments = learnerSubmissions.filter(item => item.learner_id === learnerId);

      const weightedAverage = calculateWeightedAverage(assignments, learnerAssignments);

      if (weightedAverage !== 0) {
          assignments.forEach(assignment => {
              const submission = learnerAssignments.find(sub => sub.assignment_id === assignment.id);
              if (submission) {
                  const scorePercentage = (submission.submission.score / assignment.points_possible) * 100;
                  weightedAverages[assignment.id] = scorePercentage.toFixed(2);
              }
          });
          if (!learnerData.some(item => item.id == learnerId)) {
          learnerData.push({
              id: learnerId,
              avg: weightedAverage.toFixed(2),
              ...weightedAverages
          });
        }
      }
  });

  return learnerData;
}

const courseInfo = { id: 451, name: "Introduction to JavaScript" };
const assignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
      { 
          id: 1, 
          name: "Declare a Variable", 
          due_at: "2023-01-25", 
          points_possible: 50 
      },
      {
          id: 2,
          name: "Write a Function",
          due_at: "2023-02-27",
          points_possible: 150
      },
      {
          id: 3,
          name: "Code the World",
          due_at: "3156-11-15",
          points_possible: 500
      }
  ],
};

const learnerSubmissions = [
  {
      learner_id: 125,
      assignment_id: 1,
      submission: {
          submitted_at: "2023-01-25",
          score: 47
      }
  },
  {
      learner_id: 125,
      assignment_id: 2,
      submission: {
          submitted_at: "2023-02-12",
          score: 150
      }
  },
  {
      learner_id: 125,
      assignment_id: 3,
      submission: {
          submitted_at: "2023-01-25",
          score: 400
      }
  },
  {
      learner_id: 132,
      assignment_id: 1,
      submission: {
          submitted_at: "2023-01-24",
          score: 39
      }
  },
  {
      learner_id: 132,
      assignment_id: 2,
      submission: {
          submitted_at: "2023-03-07",
          score: 140
      }
  }
];

// Execute the function and log the result
const result = getLearnerData(courseInfo, assignmentGroup, learnerSubmissions);
result.forEach(data => {
  console.log(`Learner ID: ${data.id}, Weighted Average: ${data.avg}%`);
  Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'avg') {
          console.log(`Assignment ${key}: ${value}`);
      }
  });
  console.log('\n');
});