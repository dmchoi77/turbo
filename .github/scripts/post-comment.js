const fs = require('fs');
const path = require('path');

// Read comparison from file to avoid YAML/JavaScript escaping issues
let commentBody = '';
try {
  const comparisonDir = 'comparison-results';
  if (fs.existsSync(comparisonDir)) {
    const comparisonFiles = fs.readdirSync(comparisonDir);
    for (const file of comparisonFiles) {
      if (file.endsWith('.md')) {
        const content = fs.readFileSync(
          path.join(comparisonDir, file),
          'utf-8'
        );
        if (commentBody) {
          commentBody += '\n\n---\n\n' + content;
        } else {
          commentBody = content;
        }
      }
    }
  }
} catch (error) {
  console.log('Error reading comparison files:', error.message);
  // Fallback to output if file reading fails
  const output = process.env.COMPARISON_OUTPUT || '';
  if (output && output.trim()) {
    commentBody = output.trim();
  }
}

if (!commentBody || !commentBody.trim()) {
  console.log('No comment body to post');
  process.exit(0);
}

const existingCommentId = (process.env.EXISTING_COMMENT_ID || '').trim();

if (existingCommentId) {
  await github.rest.issues.updateComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    comment_id: parseInt(existingCommentId),
    body: commentBody,
  });
  console.log('Updated existing comment');
} else {
  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: commentBody,
  });
  console.log('Created new comment');
}

