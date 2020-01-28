import { getIssueNumberFromIssue } from '@thunder/lib/utils'

const pricesColor = {
  low: 'rgb(255, 205, 86)',
  normal: 'rgb(54, 162, 235)',
  high: 'rgb(255, 102, 102)'
}

const Issues = {

  injectElements() {
    const issuesHTMLCollection = document.querySelector('#js-repo-pjax-container > div.container-lg.clearfix.new-discussion-timeline.experiment-repo-nav.px-3 > div > div > div.Box.mt-3 > div:nth-child(2) > div').children
  
    const issues = [...issuesHTMLCollection]
    issues.forEach(issue => {
      const issueNumber = getIssueNumberFromIssue(issue)
      //const price = contract.getIssuePrice(issueNumber)
      //if (price) add badge about the price
      //now add in all issues

      document.querySelector(`#issue_${issueNumber}_link`)
      .insertAdjacentHTML('afterend', `
        <span style="margin-left: 10px;
          margin-right: 5px;
          font-weight: bold;
          height: 20px;
          padding: .15em 4px;
          font-size: 12px;
          font-weight: 600;
          line-height: 15px;
          border-radius: 2px;
          background-color: ${pricesColor['high']};">
          0.004 eth
        </span>
      `)
    })
  }
}

export default Issues