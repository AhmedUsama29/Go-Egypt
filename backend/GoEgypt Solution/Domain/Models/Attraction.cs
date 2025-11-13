using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Attraction
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Overview { get; set; }
        public TimeOnly OpeningTime { get; set; }
        public TimeOnly ClosingTime { get; set; }
        public List<KeyFact> KeyFacts { get; set; }
        public string MainPhotoPath { get; set; }
        public string Category { get; set; }
        public List<string> Gallery { get; set; }
    }

    public class KeyFact
    {
        public string Headline { get; set; }
        public string Description { get; set; }
    }
}
