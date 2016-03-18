# Octokit.NET - Rewrite HTTP internals.
#### Devesh Khandelwal @devkhan
###### Proposal for *Google Summer of Code*
###### Mentoring Organization: GitHub
###### Mentor: Brendan Forster @shiftkey


### What the project is about?

I cannot summarize what this project is about better than @shiftkey has described it [here](https://github.com/octokit/octokit.net/issues/781) and [here](https://github.com/octokit/octokit.net/issues/984). But still, to show that I understand what this project aims at, I'll give it a shot.

Right now, Octokit is a very large project with a lot of conceptually different parts, loosely connected together by the efforts of some very talented people. But, still, to maintain the increasing complexity of the GitHub API, there is a need to break it down to into multiple components. One of the major components is the HTTP calling part, which is completely independent of the particulars of the API. It inlcudes re-writing the actual HTTP plumbing, getting the abstractions right, enabling Octokit's users to plug in their own HTTP client with modified behaviour such as custom caching, timeout, among other things.

**I will make a lot of references and quotes, mostly from Octokit's conversations. No copyright infringement intended.**

### What will be the outcome?™

Completion of this project will enable new possibilities for its users, some of them are as follows:

- Moving as much of the HTTP plumbing out of Octokit as possible. Providing it as a different package. It will be pluggable into the `GitHubClient`. It would be something like:

```c#
var info = new ClientInfo
{
    AppName = "my-cool-app",
    Credentials = new Credentials("my-token"),
    Server = "https://enterprise.my-work.com",
    UseDefaultProxy = true
};

var http = HttpClientFactory.Create(info);
var client = new GitHubClient(http);
```

The most important goal here is to de-couple the currently tangled up parts of Octokit. For example, hand-made HTTP requests can be made through GitHubClient.Connection. Right now, Octokit.NET does a lot of things and does so under one roof. This reduces maintainebility of Octokit and may un-necessarily breaks pparts if an even completely unrelated part is modified. Decoupling these parts will allow the development of both of them faster and leaner. Contributors can focus on parts of their choice and don't need to know the complete architecture of Octokit.

- If someone doesn't want to use the `HttpClient` used by Octokit, they can swap it with thier own HttpClient. For example, if someone wants to use their own caching implementaion or timeouts, etc., they will be able to do so by supplying their own implementation.

### Approach

The current structure of the project is as somewhat below:

- The entrypoint into the library is GitHubClient which needs an IConnection parameter either by explicitally providing a parameter or it will instantiate its own based on the options given such as ProductHeaderValue, BaseAdress, etc.
- It then creates an IApiConnection from it, which it keeps reference to and also passes onto its properties(Clients) which represents the various parts of the API.
- All of these clients call the methods of IApiConnection, which in turn calls the methods of IConnection, which finally calls out the HttpClientAdapter.
- There are also many other things, but they are secondary to the problem which this project addresses.

![Dependency Diagram](DependencyGraphSnapshot.png "Dependency Diagram for HTTP internals of Octokit")

As I mentioned, the most important part is GitHubClient will take an HttpClient as a parameter instead of an IConnection, which provides a friendly wrapper around the low-level calls of HttpClientAdapter. We will have a direct dependency on System/Microsoft's HttpClient. 



### Why me?



*Namaste*

