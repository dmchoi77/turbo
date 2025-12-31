const { data: comments } = await github.rest.issues.listComments({
  owner: context.repo.owner,
  repo: context.repo.repo,
  issue_number: context.issue.number,
});

const botComment = comments.find(
  (comment) =>
    comment.user.type === 'Bot' &&
    comment.body.includes('Bundle Size Comparison')
);

core.setOutput('result', botComment?.id || '');

