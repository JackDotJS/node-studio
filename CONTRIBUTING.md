<div align="center">
  <img src="https://raw.githubusercontent.com/JackDotJS/node-studio/tauri/src-tauri/icons/icon.png" width="128px">
  <h3>Node Studio</h3>
  <h1>Contributing Guidelines</h1>
</div>

<ol>
  <li>
    <b>Try to keep your code clean and readable.</b>
    <br><br>
    At the very least, comment your work as much as possible. Making code easy to follow is crucial for me and fellow developers. As a general rule of thumb:
    <br><br>
    <ul>
      <li>
        If you think your future self might not be able to read it, it needs a comment.
      </li>
      <li>
        If you used a clever one-liner, explain the process in a comment.
      </li>
      <li>
        If you used some obscure variable name, explain what it means in a comment.
      </li>
      <li>
        If your logic is convoluted, explain each step in a comment.
      </li>
    </ul>
    <br>
  </li>

  <li>
    <b>Avoid adding third-party dependencies to the project.</b>
    <br><br>
    Dependencies add a potential point of failure, and a somewhat unknown variable to the project's stability and security. Certain dependencies may also needlessly bloat the project size, which is very undesirable for end-users. This is why Node Studio uses as little dependencies as possible. 
    <br><br> 
    If your contribution requires adding a new dependency, please make sure you do your research before proposing it in a pull request. Ask yourself questions like:
    <br><br>
    <ul>
      <li>
        Is the dependency actively maintained?
      </li>
      <li>
        How much of the dependency would be used? If not much, could we simply replicate the needed functionality for our use case?
      </li>
      <li>
        Does the dependency provide functionality for more than one or two parts of our code?
      </li>
      <li>
        Can vanilla JS features or Rust provide similar functionality?
      </li>
    </ul>
    <br>
  </li>

  <li>
    <b>Avoid pushing large amounts of work in individual commits.</b>
    <br><br>
    Understanding what was changed helps everyone involved with keeping track of your progress, and also helps to find bugs if/when they appear. Try to work on bits and pieces at a time, and commit them separately.
    <br><br>
  </li>

  <li>
    <b>Try to keep commit messages/descriptions clear, relevant, and concise.</b>
    <br><br> 
    As a general rule of thumb:
    <br><br>
    <table>
      <tr>
        <th> ✅ DO </th>
        <th> ❌ DON'T </th>
      </tr>
      <tr>
        <td> <code>package: add app icon to build params</code> </td>
        <td> <code>finally fixed this stupid box </code> </td>
      </tr>
      <tr>
        <td> <code>piano: improved mouse/cursor interactions</code> </td>
        <td> <code>OH MY GOD IT WORKS???</code> </td>
      </tr>
      <tr>
        <td> <code>improved default ui theme colors</code> </td>
        <td> <code>this. makes me suffer</code> </td>
      </tr>
    </table>
    <br>
  </li>
</ol>