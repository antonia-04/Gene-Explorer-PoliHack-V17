export async function getTop20GeneInteractions(gene: string) {
    const query = `
    query {
      genes(names: ["${gene}"]) {
        nodes {
          interactions {
            drug {
              name
            }
            interactionScore
          }
        }
      }
    }
  `;

    try {
        const response = await fetch("https://dgidb.org/api/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query })
        });

        const json = await response.json();

        const interactions = json?.data?.genes?.nodes?.[0]?.interactions;

        if (!interactions || interactions.length === 0) {
            console.log(`No interactions found for gene: ${gene}`);
            return [];
        }

        // Sort by interactionScore (descending) and take top 5
        const top5 = interactions
            .filter((i: any) => i.interactionScore !== null)
            .sort((a: any, b: any) => b.interactionScore - a.interactionScore)
            .slice(0, 20);

        // top5.forEach((interaction: any, index: number) => {
        //     console.log(
        //         `${index + 1}. Drug: ${interaction.drug.name}, Score: ${interaction.interactionScore}`
        //     );
        // });

        return top5;
    } catch (error) {
        console.error("Error fetching from DGIdb:", error);
        return [];
    }
}

// 🔬 Example usage:
// getTop20GeneInteractions("BRAF");
