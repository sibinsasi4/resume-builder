import { parseResumeStructure } from '../lib/services/resumeStructureParser';

const sampleResume = `
John Doe
john.doe@example.com
(123) 456-7890
https://linkedin.com/in/johndoe

Professional Summary
Experienced software engineer with 5 years of experience in React and Node.js.

Experience
Senior Developer
Tech Corp
Jan 2020 - Present
Led a team of 5 developers. Built scalable APIs.

Junior Developer
Startup Inc
Jan 2018 - Dec 2019
Worked on frontend components.

Education
Bachelor of Science in Computer Science
University of Technology
2014 - 2018

Skills
JavaScript, TypeScript, React, Node.js, SQL, AWS
`;

console.log('Testing Resume Parser...');
const result: any = parseResumeStructure(sampleResume);

console.log('--- Result ---');
console.log(JSON.stringify(result, null, 2));

// Assertions
const errors: string[] = [];

if (result.personalInfo.fullName !== 'John Doe') errors.push('Name mismatch');
if (result.personalInfo.email !== 'john.doe@example.com') errors.push('Email mismatch');
if (result.personalInfo.phone !== '(123) 456-7890') errors.push('Phone mismatch');
if (result.personalInfo.linkedin !== 'https://linkedin.com/in/johndoe') errors.push('LinkedIn mismatch');

if (!result.summary.includes('Experienced software engineer')) errors.push('Summary mismatch');

if (result.experience.length !== 1) errors.push('Experience count mismatch (expected 1 block)');
if (!result.experience[0]?.description?.[0]?.includes('Tech Corp')) errors.push('Experience content mismatch');

if (result.education.length !== 1) errors.push('Education count mismatch');
if (!result.education[0]?.achievements?.[0]?.includes('University of Technology')) errors.push('Education content mismatch');

if (result.skills.length !== 1) errors.push('Skills count mismatch');
if (!result.skills[0]?.items?.includes('React')) errors.push('Skills content mismatch');

if (errors.length > 0) {
    console.error('❌ Verification Failed:', errors);
    process.exit(1);
} else {
    console.log('✅ Verification Passed!');
}
