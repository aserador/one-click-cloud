
<p align="center">
  <img src="https://github.com/AudricSerador/one-click-cloud/assets/108915409/80129b58-c016-44d8-aeab-1933d6f40c95" alt="Cloud Image" />
</p>

<h2 align="center">
  Bring the cloud closer to you.
</h2>

<p align="center">
  <a href="https://www.stratus.boo/">https://www.stratus.boo/</a>
</p>

<p align="center">
  Created by Audric Serador, Rohan Kapur, and Alex Badir
</p>

## Inspiration
On Rohan's first time using AWS, he accidentally racked up a bill in the hundreds of dollars by provisioning an overly large EC2 instance. After Audrik developed a brand new website, he spent more time trying to deploy it than he spent building it. Struggling with the cloud is every new developer's right of passage.

The cloud is hard, intimidating and (potentially) expensive to learn. We're here to change that by lowering the barrier to entry for cloud services.

## What it does
Stratus is a no-code tool for developing and deploying cloud architecture that allows you to utilize the full power of the cloud without the steep learning curve typically associated with it. Named after a type of low-floating cloud (the ones in the sky, not the computing one), we are literally _bringing the cloud closer to you_.

Stratus works by learning about your tech stack and suggesting potential infrastructure templates with clear costs, pros and cons for each suggestion. You can choose to start from a template, or scratch, and use our drag-and-drop no-code tool to develop your resource diagram. Once you're done, Sratus allows you to deploy your code with a single CLI command.

## How we built it
Stratus is powered by Next.js and React and hosted using AWS ECS, ECR, Fargate and Route53. We're using react-flow and tailwind for the frontend, and terraform for the Infrastructure as Code process. 

Our approach to building Stratus was iterative - expanding on functionality almost like an onion. The first thing we built was a bare-bones site that would create a terraform template based on your selected option. Since then, we've been doing iterative "sprints" to add additional AWS services, improve the frontend, add an interactive graph and more. I'm writing this as we're in the middle of Iteration 2, hoping to finish it before 7 am.

## Challenges we ran into
One of the early problems we ran into while building Stratus was creating an S3 bucket which could serve static files. Unbeknownst to us, late last year AWS modified policies to prevent users from accidentally exposing their private buckets, rendering most documentation on the subject out of date. 

## What's next for Stratus
We have a lot planned for the future of Stratus - multi-cloud support, more AWS services, a custom CLI, a github action to auto-deploy your code and much more. Although our attention is focused on our short-term technical goals, we remain committed to our main goal - making the cloud more accessible.
