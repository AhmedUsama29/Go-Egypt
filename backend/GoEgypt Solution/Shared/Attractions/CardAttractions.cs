using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Attractions
{
    public class CardAttractions
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public TimeOnly OpeningTime { get; set; }
        public TimeOnly ClosingTime { get; set; }
        public string Overview { get; set; }
        public string MainPhotoPath { get; set; }
        public string Category { get; set; }


    }
}
