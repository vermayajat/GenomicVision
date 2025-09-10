function analyzeSequences() {
    let seq1 = document.getElementById("sequence1").value.trim().toUpperCase();
    let seq2 = document.getElementById("sequence2").value.trim().toUpperCase();
    let output = document.getElementById("output");

    // Validate input
    if (!seq1 || !seq2) {
        output.innerHTML = "<p style='color:red;'>⚠️ Please enter both DNA sequences.</p>";
        return;
    }

    let validDNA = /^[ACGT]+$/;
    if (!validDNA.test(seq1) || !validDNA.test(seq2)) {
        output.innerHTML = "<p style='color:red;'>⚠️ Invalid input! DNA must contain only A, C, G, T.</p>";
        return;
    }

    // Calculate LCS
    let lcs = calculateLCS(seq1, seq2);

    // Calculate similarity percentage
    let similarity = ((lcs.length * 2) / (seq1.length + seq2.length) * 100).toFixed(2);

    // Highlight mutations (mismatches)
    let mutations = highlightMutations(seq1, seq2);

    // Display result
    output.innerHTML = `
        <h2>DNA Analysis Results</h2>
        <p><b>Length of Sequence 1:</b> ${seq1.length}</p>
        <p><b>Length of Sequence 2:</b> ${seq2.length}</p>
        <p><b>Longest Common Subsequence (LCS) Length:</b> ${lcs.length}</p>
        <p><b>LCS:</b> <span style="color:lightgreen;">${lcs.sequence}</span></p>
        <p><b>Similarity:</b> ${similarity}%</p>
        <h3>Mutation Analysis</h3>
        <p><b>Sequence 1:</b> ${mutations.seq1}</p>
        <p><b>Sequence 2:</b> ${mutations.seq2}</p>
    `;
}

// Longest Common Subsequence (DP)
function calculateLCS(X, Y) {
    let m = X.length, n = Y.length;
    let dp = Array.from(Array(m+1), () => Array(n+1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (X[i-1] === Y[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }

    // Reconstruct LCS
    let lcs = "";
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (X[i-1] === Y[j-1]) {
            lcs = X[i-1] + lcs;
            i--; j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;
        } else {
            j--;
        }
    }
    return { length: dp[m][n], sequence: lcs };
}

// Highlight mutations
function highlightMutations(seq1, seq2) {
    let maxLen = Math.max(seq1.length, seq2.length);
    let s1 = "", s2 = "";

    for (let i = 0; i < maxLen; i++) {
        if (seq1[i] === seq2[i]) {
            s1 += seq1[i] || "-";
            s2 += seq2[i] || "-";
        } else {
            s1 += `<span style="color:red;">${seq1[i] || "-"}</span>`;
            s2 += `<span style="color:red;">${seq2[i] || "-"}</span>`;
        }
    }
    return { seq1: s1, seq2: s2 };
}
